import type { Phase } from "~/database/schema";

export function getCurrentPhase(phases: Phase[]): Phase | null {
    if (!phases || phases.length === 0) {
        return null;
    }

    for (let i = phases.length - 1; i >= 0; i--) {
        if (phases[i].status && phases[i].status.toLowerCase() === 'in progress') {
            return phases[i];
        }
    }
    for (let i = 0; i < phases.length; i++) {
        if (phases[i].status && phases[i].status.toLowerCase() === 'todo') {
            return phases[i];
        }
    }

    return null;
}

export function getNextPhase(phases: Phase[], currentPhase: Phase | null): Phase | null {
    if (!phases || phases.length === 0 || !currentPhase) {
        return null;
    }

    const currentIndex = phases.findIndex(phase => phase.id === currentPhase.id);

    if (currentIndex === -1 || currentIndex >= phases.length - 1) {
        return null;
    }
    return phases[currentIndex + 1];
}