export default function () {
	return `SELECT transfer_time_ms
            FROM transfers
            ORDER BY transfer_time_ms DESC
            LIMIT 1`;
}
