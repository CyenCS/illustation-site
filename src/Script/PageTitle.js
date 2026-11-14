import { useEffect } from "react";

function PageTitle( title ) {
    useEffect(() => {
        document.title = title ? `${title}` : "Illustation";
    }, [title]);
    return null;
}

export default PageTitle;