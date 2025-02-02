import React, { Component, createRef, RefObject } from "react";
import Tick from "@pqina/flip";
import "@pqina/flip/dist/flip.min.css";

interface FlipProps {
  value: number;
}

export default class Flip extends Component<FlipProps> {
  private _tickRef: RefObject<HTMLDivElement>;
  private _tickInstance: any;

  constructor(props: FlipProps) {
    super(props);
    this._tickRef = createRef<HTMLDivElement>();
  }

  componentDidMount() {
    if (this._tickRef.current) {
      this._tickInstance = Tick.DOM.create(this._tickRef.current, {
        value: this.props.value,
      });
    }
  }

  componentDidUpdate() {
    if (!this._tickInstance) return;
    this._tickInstance.value = this.props.value;
  }

  componentWillUnmount() {
    if (this._tickInstance && this._tickRef.current) {
      Tick.DOM.destroy(this._tickRef.current);
    }
  }

  render() {
    return (
      <div ref={this._tickRef} className="tick">
        <div data-repeat="true" aria-hidden="true">
          <span data-view="flip">Tick</span>
        </div>
      </div>
    );
  }
}
