import { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { OrderPopupData } from "@/store/allOptionsStore";
import ApplicationComponent from "../applicationComponent/ApplicationComponent";

export default function OrderPopup({ activeOrderPopup, orderPopupData, language }: { activeOrderPopup: boolean; orderPopupData: OrderPopupData | null; language: string }) {
	const [activePopupItem, setActivePopupItem] = useState(0);

	useEffect(() => {
		// console.log(popupData);
	}, [orderPopupData]);
	return (
		<>
			<div className={`${styles.orderPopupHud} ${activeOrderPopup ? styles.active + " active" : ""}`}>
				<ApplicationComponent language={language} data={orderPopupData} isPopup={true} />
			</div>
		</>
	);
}
