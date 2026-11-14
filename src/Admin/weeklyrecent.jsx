const WeeklyRecent = () => {
    const registry = [{ name: 'timmy', date: '2023-10-01' },
              { name: 'leo', date: '2023-10-02' },
              { name: 'jane', date: '2023-10-03' },
              { name: 'dev', date: '2023-10-04' },
              { name: 'sam', date: '2023-11-03' }]

const artwork = [{ title: 'Landscape Study', date: '2023-10-01' },
              { title: 'Character Illustration', date: '2023-10-02' },
              { title: 'Night City', date: '2023-10-03' },
              { title: 'Rainbow', date: '2023-10-04' },
              { title: 'Hill', date: '2023-11-03' }];
              
    return (
        <>
        <div className="recent-table">
          <h2>Recent Users</h2>

          <table className="data-table">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
              
                {registry.map((item) => (
                    <tr key={item.name}>
                        <td>{item.name}</td>
                        <td>{item.date}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div>View user list</div>
        </div>
        
        <div className="recent-table">
          <h2>Recent Artworks</h2>

          <table className="data-table">
            <thead>
                <tr>
                    <th>Day</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
              {artwork.map((item) => (
                    <tr key={item.title}>
                        <td>{item.title}</td>
                        <td>{item.date}</td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        <div>View artwork list</div>
        </div>
        </>
    );
}

export default WeeklyRecent;