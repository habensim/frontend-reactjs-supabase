import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner, { PageLoader, ButtonLoader } from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Memuat...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text" />);
    expect(screen.getByText('Custom loading text')).toBeInTheDocument();
  });

  it('renders without text', () => {
    render(<LoadingSpinner text="" />);
    expect(screen.queryByText('Memuat...')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSpinner className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});

describe('PageLoader', () => {
  it('renders page loader with correct text', () => {
    render(<PageLoader />);
    expect(screen.getByText('Memuat halaman...')).toBeInTheDocument();
  });

  it('has full screen height', () => {
    const { container } = render(<PageLoader />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});

describe('ButtonLoader', () => {
  it('renders button loader with correct text', () => {
    render(<ButtonLoader />);
    expect(screen.getByText('Memproses...')).toBeInTheDocument();
  });

  it('renders with custom size', () => {
    render(<ButtonLoader size="lg" />);
    const spinner = document.querySelector('.h-12.w-12');
    expect(spinner).toBeInTheDocument();
  });
});
