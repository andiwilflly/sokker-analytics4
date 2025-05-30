export {};

declare global {
	interface ITransfer {
		id: string;
		pid: number;
		name: string;
		country: number;
		age: number;
		height: number;
		weight: number;
		season: number;
		week: number;
		price: number;
		form: number;
		stamina: number;
		pace: number;
		technique: number;
		passing: number;
		keeper: number;
		defender: number;
		playmaker: number;
		striker: number;
		value: number;
		wage: number;

		all_skills: number;
		att_SS: number;
		def_SS: number;
		mid_SS: number;
		gk_SS: number;
		transfer_time_ms: number;
	}

	interface ITransferShortNames {
		id: string; // id
		pid: number; // player id
		n: string; // name
		c: number; // country
		a: number; // age
		h: number; // height
		w: number; // weight
		s: number; // season
		wk: number; // week
		p: number; // price
		f: number; // form
		st: number; // stamina
		pc: number; // pace
		tc: number; // technique
		ps: number; // passing
		kp: number; // keeper
		df: number; // defender
		pm: number; // playmaker
		sr: number; // striker
		si?: number; // seller_id (optional if not always present)
		bi?: number; // buyer_id (optional if not always present)
		ss: number; // all_skills
		ass: number; // att_SS
		dss: number; // def_SS
		mss: number; // mid_SS
		gss: number; // gk_SS
		tt: number; // transfer_time_ms
	}

	interface ITransferStatBlockValues {
		count: number[];
		percent: number[];
		price_max: number[];
		price_avg: number[];
		price_min: number[];
	}

	interface ITransferStatBlock {
		labels: (string | number)[];
		values: ITransferStatBlockValues;
	}

	interface ITransfersPrepare {
		country: ITransferStatBlock;
		height: ITransferStatBlock;
		weekday: ITransferStatBlock;
		count: number;
	}

	interface ITransferGridItemModelArguments {
		i: string;
		x: number;
		w: number;
		h: number;
		selectedX: keyof ITransfersPrepare;
		selectedY: Array<keyof ITransferStatBlockValues>;
	}
}
