import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    void error;
    void info;
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><section className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm"><i className="bi-exclamation-octagon text-4xl text-red-600" /><h1 className="mt-4 text-2xl font-bold text-gray-900">Algo deu errado</h1><p className="mt-2 text-sm text-gray-600">Recarregue a página. Se o problema continuar, entre em contato com a administração.</p><button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-lg bg-amber-700 px-4 py-2 font-medium text-white hover:bg-amber-800">Recarregar página</button></section></main>;
  }
}
