/** Own demo resources per mounted instance. Reset/dispose never touches another story. */
export class DemoHarness {
  private readonly cleanups = new Set<() => void>();
  private destroyed = false;
  own(dispose: () => void): () => void {
    let active = true;
    const release = () => {
      if (!active) return;
      active = false;
      this.cleanups.delete(release);
      dispose();
    };
    if (this.destroyed) release();
    else this.cleanups.add(release);
    return release;
  }
  reset() {
    for (const release of [...this.cleanups]) release();
  }
  destroy() {
    this.destroyed = true;
    this.reset();
  }
}
