
const WeeklyStats = (stats) => {
    return(
    <>
        <div>Total Users: <p>{stats.totalUsers}</p></div>
        <div>Total Artworks: <p>{stats.totalArtworks}</p></div>
        <div>New Users: <p>{stats.newUsers}</p></div>
        <div>New Artworks: <p>{stats.newArtworks}</p></div>
    </>
    );
}

export default WeeklyStats;