import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '../Navbar';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('Navbar', () => {
  const defaultProps = {
    activeTab: 'profile' as const,
    onTabChange: vi.fn(),
    onAskAI: vi.fn(),
    onDownloadCV: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders all 4 tab buttons', () => {
    render(<Navbar {...defaultProps} />);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Looking For')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  it('clicking a tab calls onTabChange with correct id', async () => {
    render(<Navbar {...defaultProps} />);
    await userEvent.click(screen.getByText('Career'));
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('career');
  });

  it('Ask AI button calls onAskAI', async () => {
    render(<Navbar {...defaultProps} />);
    await userEvent.click(screen.getByText('Ask AI'));
    expect(defaultProps.onAskAI).toHaveBeenCalledTimes(1);
  });

  it('Download CV button calls onDownloadCV', async () => {
    render(<Navbar {...defaultProps} />);
    await userEvent.click(screen.getByText('Download CV'));
    expect(defaultProps.onDownloadCV).toHaveBeenCalledTimes(1);
  });

  it('LinkedIn link has correct href', () => {
    render(<Navbar {...defaultProps} />);
    const link = screen.getByRole('link', { name: /linkedin/i });
    expect(link).toHaveAttribute('href', 'https://www.linkedin.com/in/alex-farman-53575a106/');
  });

  it('applies compact class after scrolling past 80px', () => {
    render(<Navbar {...defaultProps} />);
    // Simulate scroll event
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);
    // The bar div should have h-10 class (compact)
    const bar = document.querySelector('.max-w-5xl');
    expect(bar?.className).toContain('h-10');
  });
});
