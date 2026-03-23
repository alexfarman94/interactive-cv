import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TabNav } from '../TabNav';

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('TabNav', () => {
  it('shows no prev button on the first tab (profile)', () => {
    render(<TabNav activeTab="profile" onTabChange={vi.fn()} />);
    expect(screen.queryByText(/Personal Profile/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Career History/i)).toBeInTheDocument();
  });

  it('shows no next button on the last tab (projects)', () => {
    render(<TabNav activeTab="projects" onTabChange={vi.fn()} />);
    expect(screen.getByText(/What I'm Looking For/i)).toBeInTheDocument();
    expect(screen.queryByText(/Projects/i)).not.toBeInTheDocument();
  });

  it('shows both prev and next on a middle tab (career)', () => {
    render(<TabNav activeTab="career" onTabChange={vi.fn()} />);
    expect(screen.getByText(/Personal Profile/i)).toBeInTheDocument();
    expect(screen.getByText(/What I'm Looking For/i)).toBeInTheDocument();
  });

  it('clicking next calls onTabChange with next tab id', async () => {
    const onTabChange = vi.fn();
    render(<TabNav activeTab="profile" onTabChange={onTabChange} />);
    await userEvent.click(screen.getByText(/Career History/i));
    expect(onTabChange).toHaveBeenCalledWith('career');
  });

  it('clicking prev calls onTabChange with prev tab id', async () => {
    const onTabChange = vi.fn();
    render(<TabNav activeTab="career" onTabChange={onTabChange} />);
    await userEvent.click(screen.getByText(/Personal Profile/i));
    expect(onTabChange).toHaveBeenCalledWith('profile');
  });
});
