import './items-count-card.css';
import { IconPackage, IconChartHistogram, IconClock, IconCircleDashedCheck, IconBusinessplan } from '@tabler/icons-react';

export default function ItemsCountCard({icon, title, count, color}: {icon: string, title: string, count: number, color: string}) {
    return (
        <div className={`items-count-card ${color}`}>
            <div className={`icon ${color}`}>
                {icon === 'package' && <IconPackage />}
                {icon === 'chart' && <IconChartHistogram />}
                {icon === 'clock' && <IconClock />}
                {icon === 'check' && <IconCircleDashedCheck />}
                {icon === 'businessplan' && <IconBusinessplan />}
            </div>
            <div className="item-count-content">
                <h3>{title}</h3>
                <p>{count.toLocaleString()}</p>
            </div>
        </div>
    )
}