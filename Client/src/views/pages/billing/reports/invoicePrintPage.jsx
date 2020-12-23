import React from "react";
import Reports from './script/stimulsoft.reports'
import ReportViewer from './script/stimulsoft.viewer'
import style from './style/stimulsoft.viewer.office2013.whiteblue.css'


class Viewer extends React.Component {
    render() {
        return <div id="viewer"></div>;
    }

    componentDidMount() {

        var viewer = new ReportViewer.StiViewer(null, 'StiViewer', false);

        var report = new Reports.StiReport();

        report.loadFile('/reports/SimpleList.mrt');

        viewer.report = report;

        viewer.renderHtml('viewer');
    }
}

ReactDOM.render(
    <Viewer />,
    document.getElementById("main")
)     