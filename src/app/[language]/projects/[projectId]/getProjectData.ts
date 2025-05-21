// src/lib/getProjectData.ts

interface Project {
	id: number;
	lang: string;
	slug: string;
	acf: any;
	[otherProps: string]: any;
}

interface Award {
	id: number;
	name: string;
	slug: string;
	acf: any;
}

export async function getProjectData(language: string, projectId: string) {
	const API_URL = process.env.NEXT_PUBLIC_WP_API;
	process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

	if (!API_URL) throw new Error("NEXT_PUBLIC_WP_API не задан");

	try {
		const projectsRes = await fetch(`${API_URL}/projects?per_page=100&_embed`, {
			next: { revalidate: 3600 },
			headers: { Accept: "application/json" },
		});
		const projects: Project[] = await projectsRes.json();

		const foundProject = projects.find((p) => p.slug === projectId && p.lang === language);
		if (!foundProject) return null;

		const awardsRes = await fetch(`${API_URL}/awards?per_page=100&_fields=id,name,slug,acf`, {
			next: { revalidate: 3600 },
			headers: { Accept: "application/json" },
		});
		const allAwards: Award[] = await awardsRes.json();

		const awards = foundProject.acf?.project_awards || [];

		const updatedAwards = awards
			.map((entry: any) => {
				const award = entry.award;
				if (!award?.title || !award.year) return null;

				const term = award.title;
				const fullAward = allAwards.find((a) => a.id === term.term_id);
				if (!fullAward) return null;

				return {
					term_id: term.term_id,
					name: term.name,
					slug: term.slug,
					acf: fullAward.acf || {},
					year: award.year,
					nominations: award.nominations || [],
				};
			})
			.filter(Boolean);

		foundProject.acf.project_awards = updatedAwards;

		return foundProject;
	} catch (error) {
		console.error("Ошибка при получении projectData:", error);
		return null;
	}
}
