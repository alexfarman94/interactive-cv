import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LeadCaptureModal } from '../LeadCaptureModal';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, onClick, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div onClick={onClick} {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('LeadCaptureModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Stub fetch so Formspree submission doesn't actually fire
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    // Prevent anchor click from throwing in jsdom
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  });

  it('does not render when isOpen is false', () => {
    render(<LeadCaptureModal isOpen={false} onClose={defaultProps.onClose} />);
    expect(screen.queryByText(/Download Alex's CV/i)).not.toBeInTheDocument();
  });

  it('renders form fields when isOpen is true', () => {
    render(<LeadCaptureModal {...defaultProps} />);
    expect(screen.getByPlaceholderText(/Your name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Your email address/i)).toBeInTheDocument();
  });

  it('submit button is disabled when email is empty', () => {
    render(<LeadCaptureModal {...defaultProps} />);
    const btn = screen.getByRole('button', { name: /Get CV/i });
    expect(btn).toBeDisabled();
  });

  it('submit button is enabled when email is filled', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.type(screen.getByPlaceholderText(/Your email address/i), 'test@example.com');
    const btn = screen.getByRole('button', { name: /Get CV/i });
    expect(btn).not.toBeDisabled();
  });

  it('close button calls onClose', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByLabelText(/Close/i));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it('"Skip and download anyway" button calls onClose', async () => {
    render(<LeadCaptureModal {...defaultProps} />);
    await userEvent.click(screen.getByText(/Skip and download anyway/i));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
