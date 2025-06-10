"use client";

import { useEffect, useRef } from "react";
import styles from "./styles.module.scss";

interface Props {
	coordinates: [number, number];
	zoom?: number;
}

export default function YandexMap({ coordinates, zoom = 16 }: Props) {
	const mapRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<any>(null);
	const maskRef = useRef<HTMLDivElement>(null);
	const rafId = useRef<number | null>(null);

	useEffect(() => {
		let isMounted = true;

		function initMapAfterReady() {
			const ymaps = (window as any).ymaps;
			if (!mapRef.current || !isMounted || mapInstanceRef.current) return;

			const map = new ymaps.Map(mapRef.current, {
				center: coordinates,
				zoom: zoom,
				controls: [],
			});
			map.behaviors.enable("drag");
			mapInstanceRef.current = map;

			// Добавляем маркер
			const placemark = new ymaps.Placemark(
				coordinates,
				{},
				{
					iconLayout: "default#image",
					iconImageHref: "/images/map_cursor.svg",
					iconImageSize: [80, 80],
					iconImageOffset: [-40, -80],
				}
			);
			map.geoObjects.add(placemark);

			// Анимация движения выреза за маркером
			const animate = () => {
				const mask = maskRef.current;
				const markerEl = mapRef.current?.querySelector(".ymaps-2-1-79-placemark-overlay");
				const mapRect = mapRef.current?.getBoundingClientRect();

				if (mask && markerEl && mapRect) {
					const rect = markerEl.getBoundingClientRect();
					mask.style.transform = `translate(calc(${rect.left - mapRect.left}px - 50%), calc(${rect.top}px - 50%))`;
				}

				rafId.current = requestAnimationFrame(animate);
			};

			rafId.current = requestAnimationFrame(animate);
		}

		function loadYandexScript() {
			const existingScript = Array.from(document.getElementsByTagName("script")).find((s) => s.src.includes("https://api-maps.yandex.ru/2.1/")) as
				| HTMLScriptElement
				| undefined;

			if ((window as any).ymaps?.ready) {
				(window as any).ymaps.ready(initMapAfterReady);
				return;
			}

			if (!existingScript) {
				const script = document.createElement("script");
				script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU";
				script.async = true;
				script.onload = () => {
					(window as any).ymaps.ready(initMapAfterReady);
				};
				document.body.appendChild(script);
			} else {
				existingScript.addEventListener("load", () => {
					(window as any).ymaps.ready(initMapAfterReady);
				});
			}
		}

		loadYandexScript();

		return () => {
			isMounted = false;

			if (rafId.current) cancelAnimationFrame(rafId.current);
			if (mapInstanceRef.current) {
				mapInstanceRef.current.destroy();
				mapInstanceRef.current = null;
			}
		};
	}, []);

	useEffect(() => {
		if (mapInstanceRef.current) {
			mapInstanceRef.current.setCenter(coordinates, zoom);
		}
	}, [coordinates, zoom]);

	return (
		<div
			className={styles.yandexMap}
			style={{
				width: "100vw",
				height: "100vh",
				position: "absolute",
				left: "50%",
				top: "50%",
				transform: "translate(-50%, -50%)",
			}}
		>
			<div
				ref={mapRef}
				style={{
					width: "100%",
					height: "100%",
					position: "relative",
				}}
			/>

			<div
				className={styles.overlay}
				ref={maskRef}
				style={{
					transform: "translate(calc(0px - 50%), calc(0px - 50%))", // на старте вне экрана
				}}
			/>
		</div>
	);
}
