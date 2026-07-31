import { WidgetConfig } from "../types/widget";

export class WidgetRegistry {
  private static registry: Map<string, WidgetConfig> = new Map();

  /**
   * Register a new dashboard analytics widget.
   * Adheres to Open/Closed Principle: Allows adding new analytics widgets without mutating core dashboard code.
   */
  public static register(config: WidgetConfig): void {
    if (this.registry.has(config.widgetId)) {
      console.warn(`[WidgetRegistry] Widget "${config.widgetId}" is already registered. Overwriting.`);
    }
    this.registry.set(config.widgetId, config);
  }

  public static get(widgetId: string): WidgetConfig | undefined {
    return this.registry.get(widgetId);
  }

  public static getAll(): WidgetConfig[] {
    return Array.from(this.registry.values());
  }

  public static getByCategory(category: WidgetConfig["category"]): WidgetConfig[] {
    return Array.from(this.registry.values()).filter((w) => w.category === category);
  }

  public static unregister(widgetId: string): boolean {
    return this.registry.delete(widgetId);
  }
}
