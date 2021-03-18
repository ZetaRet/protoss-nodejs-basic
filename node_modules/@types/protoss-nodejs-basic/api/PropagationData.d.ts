declare namespace zetaret.node.api {
	export interface PropagationDataCTOR {
		new(): PropagationData
	}
	export interface PropagationData {
		isEvent: boolean;
		direction: string;
		type: string;
		cancelable: boolean;
		composed?: boolean;
		defaultPrevented?: boolean;
		eventPhase?: string;
		currentTarget?: zetaret.node.modules.Subserver | zetaret.node.modules.ServiceEncasement;
		isTrusted?: boolean;
		stopImmediatePropagation?: boolean;
		stopPropagation?: boolean;
		returnValue?: object;
		timeStamp?: number;
	}
	export interface PropagationDirection {
		PYRAMID_APEX: "pyramidApex";
		PYRAMID_VERTEX: "pyramidVertex";
		PYRAMID_CENTER: "pyramidCenter";
		PYRAMID_BASE: "pyramidBase";
		PLANE_POINT: "planePoint";
		PLANE_SIDE: "planeSide";
		PLANE_CENTER: "planeCenter";
		PLANE_INTERSECTION: "planeIntersection";
		RESIDUE_RANDOM: "residueRandom";
		RESIDUE_BUBBLE_UP: "residueBubbleUp";
	}
}