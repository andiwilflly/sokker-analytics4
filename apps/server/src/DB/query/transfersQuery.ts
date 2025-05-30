export default function (ages: string, countries: string, fields?: string[]) {
	const selectedFields = Array.isArray(fields) && fields.length > 0 ? fields.map(field => `t.${field}`).join(", ") : "t.*"; // default to selecting all fields

	return `SELECT ${selectedFields}
            FROM transfers t
            WHERE t.price > ?
              AND t.price < ?
              AND t.all_skills > ?
              AND t.all_skills < ?
              AND t.transfer_time_ms BETWEEN ? AND ?
              ${ages.length > 0 ? `AND t.age IN (${ages})` : ""}
              ${countries.length > 0 ? `AND t.country IN (${countries})` : ""}
            ORDER BY t.transfer_time_ms DESC
            LIMIT ?
	`;
}
