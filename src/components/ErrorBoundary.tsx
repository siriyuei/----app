import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({ hasError: true, error });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">
              😵
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              页面出错了
            </h2>
            <p className="text-gray-600 mb-4">
              抱歉，页面出现了意外错误。请刷新页面重试。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-cinnabar text-white rounded-lg hover:bg-cinnabar-dark transition-colors"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };