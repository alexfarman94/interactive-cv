import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QAOverlay } from '../QAOverlay';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, onKeyDown, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div onClick={onClick} onKeyDown={onKeyDown} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// agentPrompt can be anything for tests
vi.mock('../../data/agentPrompt', () => ({
  agentSystemPrompt: 'test system prompt',
}));

describe('QAOverlay', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onOpenJobAnalyzer: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is not visible when isOpen is false', () => {
    render(<QAOverlay isOpen={false} onClose={defaultProps.onClose} onOpenJobAnalyzer={defaultProps.onOpenJobAnalyzer} />);
    expect(screen.queryByText(/Ask about Alex/i)).not.toBeInTheDocument();
  });

  it('renders panel when isOpen is true', () => {
    render(<QAOverlay {...defaultProps} />);
    expect(screen.getByText(/Ask about Alex/i)).toBeInTheDocument();
  });

  it('renders 5 prompt chips on empty state', () => {
    render(<QAOverlay {...defaultProps} />);
    expect(screen.getByText(/Summarise Alex in 30 seconds/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate 5 interview questions/i)).toBeInTheDocument();
    expect(screen.getByText(/Compare Alex to this job description/i)).toBeInTheDocument();
  });

  it('close button calls onClose', async () => {
    render(<QAOverlay {...defaultProps} />);
    await userEvent.click(screen.getByLabelText(/Close/i));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('"Compare Alex" chip calls onClose and onOpenJobAnalyzer', async () => {
    render(<QAOverlay {...defaultProps} />);
    await userEvent.click(screen.getByText(/Compare Alex to this job description/i));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    expect(defaultProps.onOpenJobAnalyzer).toHaveBeenCalledTimes(1);
  });

  it('typing and submitting a message sends it and shows loading', async () => {
    // Hang the fetch so loading state persists during assertion
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(new Promise(() => {})));

    render(<QAOverlay {...defaultProps} />);
    const input = screen.getByPlaceholderText(/What's Alex's salary/i);
    await userEvent.type(input, "What are Alex's skills?");
    await userEvent.click(screen.getByRole('button', { name: '' })); // send button

    expect(screen.getByText("What are Alex's skills?")).toBeInTheDocument();
    expect(screen.getByText(/Thinking/i)).toBeInTheDocument();
  });

  it('displays assistant reply after successful fetch', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ content: [{ text: 'Alex is great at AI.' }] }),
    }));

    render(<QAOverlay {...defaultProps} />);
    const input = screen.getByPlaceholderText(/What's Alex's salary/i);
    await userEvent.type(input, 'Tell me about Alex');
    await userEvent.click(screen.getByRole('button', { name: '' }));

    await waitFor(() => {
      expect(screen.getByText('Alex is great at AI.')).toBeInTheDocument();
    });
  });

  it('shows error fallback on fetch failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<QAOverlay {...defaultProps} />);
    const input = screen.getByPlaceholderText(/What's Alex's salary/i);
    await userEvent.type(input, 'Some question here');
    await userEvent.click(screen.getByRole('button', { name: '' }));

    await waitFor(() => {
      expect(screen.getByText(/having trouble connecting/i)).toBeInTheDocument();
    });
  });
});
