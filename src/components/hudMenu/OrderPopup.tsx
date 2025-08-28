import styles from "./styles.module.scss";
import { OrderPopupData } from "@/store/allOptionsStore";
import ApplicationComponent from "../applicationComponent/ApplicationComponent";
import { useHudMenuStore } from "@/store/hudMenuStore";

export default function OrderPopup({ activeOrderPopup, orderPopupData, language }: { activeOrderPopup: boolean; orderPopupData: OrderPopupData | null; language: string }) {
	const { isTopBannerActive } = useHudMenuStore();
	return (
		<>
			<div
				className={`${styles.orderPopupHud} orderPopupHud ${activeOrderPopup ? styles.active + " active" : ""} ${
					isTopBannerActive ? styles.withTopBanner + " withTopBanner" : ""
				}`}
			>
				<ApplicationComponent language={language} data={orderPopupData} isPopup={true} />
			</div>
		</>
	);
}
