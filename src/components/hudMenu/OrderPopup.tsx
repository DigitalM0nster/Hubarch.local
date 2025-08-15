import styles from "./styles.module.scss";
import { OrderPopupData } from "@/store/allOptionsStore";
import ApplicationComponent from "../applicationComponent/ApplicationComponent";

export default function OrderPopup({ activeOrderPopup, orderPopupData, language }: { activeOrderPopup: boolean; orderPopupData: OrderPopupData | null; language: string }) {
	return (
		<>
			<div className={`${styles.orderPopupHud} ${activeOrderPopup ? styles.active + " active" : ""}`}>
				<ApplicationComponent language={language} data={orderPopupData} isPopup={true} />
			</div>
		</>
	);
}
