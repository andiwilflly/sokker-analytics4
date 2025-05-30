import store from "@/store.ts";
import { t } from "@/translations/i18n";
import { observer } from "mobx-react-lite";

const T = observer(({ children }: { children: string }) => {
	return t(children, {}, store.lang);
});

export default T;

export const _t = (text: string) => t(text, {}, store.lang);
