import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center">
          <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">
            Algo salió mal al cargar este componente.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-[8px] text-white/40 hover:text-white underline uppercase tracking-[0.2em]"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
