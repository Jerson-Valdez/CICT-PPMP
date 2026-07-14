import './dashboard-procurement-card.css';
import { 
    IconClockX, 
    IconFileStack, 
    IconClockCheck, 
    IconTransform, 
    IconCloudUpload, 
    IconClock, 
    IconClockCancel 
} from '@tabler/icons-react';

interface ProcurementCardProps {
    actionType?: string;
    description: string;
    date: string;
    value?: number;
    userFullName?: string;
    fiscalYear?: number | string;
}

export default function DashboardProcurementCard({
    actionType = 'default',
    description, 
    date, 
    value, 
    userFullName,
    fiscalYear
}: ProcurementCardProps) {

    const colorMap: Record<string, string> = {
        rejected: 'red',
        approved: 'green',
        fulfilled: 'green',
        requested: 'blue',
        reallocate: 'orange',
        upload: 'purple',
        cancel: 'gray',
        default: 'yellow'
    };

    const iconMap: Record<string, React.ReactNode> = {
        rejected: <IconClockX size={18} />,
        approved: <IconClockCheck size={18} />,
        arrived: <IconClockCheck size={18} />,
        requested: <IconFileStack size={18} />,
        reallocate: <IconTransform size={18} />,
        upload: <IconCloudUpload size={18} />,
        cancel: <IconClockCancel size={18} />,
        default: <IconClock size={18} />
    };

    const activeColor = colorMap[actionType] || colorMap.default;
    const ActiveIcon = iconMap[actionType] || iconMap.default;

    return (
        <div className="dashboard-procurement-card">
            <div className="icon-container">
                <div className={`icon ${activeColor}`}>
                    {ActiveIcon}
                </div>
            </div>
            
            <div className="card-content">
                <div className="title-fiscal-container">
                    <h3>{actionType}</h3>
                    {fiscalYear && <div className="status"><p>FY {fiscalYear}</p></div>}
                </div>
                <p>{description}</p>
                <div className="date-value-container">
                    <span>Made by: {userFullName} • {new Date(date).toLocaleString('en-PH')}</span>
                    {value !== undefined && (
                        <p className="value">
                            PHP {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}