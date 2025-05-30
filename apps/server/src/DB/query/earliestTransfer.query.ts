export default function () {
	return `SELECT tt
            FROM transfers
            ORDER BY tt
            LIMIT 1`;
}
