import './dashboard-procurement-card.css';
import { IconClockX, IconFileStack, IconClockCheck, IconTransform, IconCloudUpload, IconClock, IconClockCancel } from '@tabler/icons-react';

export default function DashboardProcurementCard({icon, title, description, date, value}: {icon?: string, title: string, description: string, date: string, value?: number}) {
    const color = (icon: string) => {
        switch(icon) {
            case 'rejected':
                return 'red';
            case 'approved':
                return 'green';
            case 'arrived':
                return 'green';
            case 'requested':
                return 'blue';
            case 'reallocate':
                return 'orange';
            case 'upload':
                return 'purple';
            case 'cancel':
                return 'gray';
            default:
                return 'yellow';
        }
    }
    return (
        <div className="dashboard-procurement-card">
            <div className="icon-container">
                <div className={`icon ${color(icon? icon : 'default')}`}>
                    {icon ? (
                        <>
                            {icon === 'rejected' && <IconClockX size={24} />}
                            {icon === 'requested' && <IconFileStack size={24} />}
                            {icon === 'approved' && <IconClockCheck size={24} />}
                            {icon === 'arrived' && <IconClockCheck size={24} />}
                            {icon === 'reallocate' && <IconTransform size={24} />}
                            {icon === 'upload' && <IconCloudUpload size={24} />}
                            {icon === 'cancel' && <IconClockCancel size={24} />}
                        </>
                    ) : (
                        <IconClock size={24} />   
                    )}
                </div>
                <div className="vertical-line"></div>
            </div>
            <div className="card-content">
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="date-value-container">
                    <span>{date}</span>
                    {value !== undefined && <p className="value">PHP {value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>}
                </div>
            </div>
        </div>
    )
}