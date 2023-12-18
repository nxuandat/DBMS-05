import React, { useEffect, useRef, useState } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler_material.css';

declare let scheduler: any;

interface SchedulerProps {
    onDataUpdated?: (action: string, ev: any, id: string) => void;
    events: any[];
    timeFormatState: boolean;
}

const Scheduler: React.FC<SchedulerProps> = ({ onDataUpdated, events, timeFormatState }) => {
    const schedulerContainer = useRef<HTMLDivElement>(null);

    const initSchedulerEvents = () => {
        if (scheduler._$initialized) {
            return;
        }

        scheduler.attachEvent('onEventAdded', (id: string, ev: any) => {
            if (onDataUpdated) {
                onDataUpdated('create', ev, id, ev.doctor);
            }
        });

        scheduler.attachEvent('onEventChanged', (id: string, ev: any) => {
            if (onDataUpdated) {
                onDataUpdated('update', ev, id, ev.doctor);
            }
        });

        scheduler.attachEvent('onEventDeleted', (id: string, ev: any) => {
            if (onDataUpdated) {
                onDataUpdated('delete', ev, id, ev.doctor);
            }
        });
        scheduler._$initialized = true;
    }

    useEffect(() => {
        scheduler.skin = 'material';
        scheduler.config.header = [
            'day',
            'week',
            'month',
            'date',
            'prev',
            'today',
            'next'
        ];
        scheduler.config.hour_date = '%g:%i %A';
        scheduler.xy.scale_width = 70;

        initSchedulerEvents();

        scheduler.init(schedulerContainer.current, new Date(2020, 5, 10));
        scheduler.clearAll();
        scheduler.parse(events);
    }, [events]);

    useEffect(() => {
        scheduler.render();
    }, [timeFormatState]);

    useEffect(() => {
        scheduler.clearAll();
        scheduler.parse(events);
      }, [events]);

    const setHoursScaleFormat = (state: boolean) => {
        scheduler.config.hour_date = state ? '%H:%i' : '%g:%i %A';
        scheduler.templates.hour_scale = scheduler.date.date_to_str(scheduler.config.hour_date);
    }

    setHoursScaleFormat(timeFormatState);

    scheduler.templates.event_text = function(start, end, event) {
        return event.text + " (Dentist: " + event.doctor + ")";
    }

    return (
        <div
            ref={schedulerContainer}
            style={{ width: '100%', height: '100%' }}
        ></div>
    );
}

export default Scheduler;
