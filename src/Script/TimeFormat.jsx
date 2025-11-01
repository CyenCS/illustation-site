import { useState, useEffect } from "react";

function FormatTime(publishTimestamp, editTimestamp) {
    //Custom Hooks to format timestamps i.e. live updates
    const [published, setPublished] = useState(null);
    const [edited, setEdited] = useState(null);

    useEffect(() => {
        const format = (ts) =>
            ts
                ? new Date(ts).toLocaleString('en-MY', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                  })
                : null;

        setPublished(format(publishTimestamp));
        setEdited(format(editTimestamp));
    }, [publishTimestamp, editTimestamp]);

    return { published, edited };
}

export default FormatTime;