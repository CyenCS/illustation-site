import { useEffect } from "react";

function PageTitle( title ) {
    useEffect(() => {
        document.title = title ? `${title}` : "Illustation";
    }, [title]);
    return null; // This component only manages document.title
}

export default PageTitle;