import { Preset } from "rete-dock-plugin/_types/presets/types";

export class DockPreset implements Preset {
  createItem(index?: number): HTMLElement | null {
	const item = document.createElement("div");
	item.className = "dock-item";
	document.getElementById("dock-container")?.appendChild(item);
	return item;
  }

  removeItem(element: HTMLElement): void {
	element.remove();
  }
}