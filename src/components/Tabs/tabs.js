import React, { useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tabs.module.css';

export const Tabs = ({ tabs }) => {
    const [activeTab, setActiveTab] = useState(0);
    const classes = useStyle(defaultClasses);

    return (
        < div className = {classes.root} >
            < div className = {classes.tabList} >
                {tabs.map((tab, index) => (
                    < button
                        key = {index}
                        className = {`${classes.tabButton} ${index === activeTab ? classes.activeTab : ''}`}
                        onClick = {() => setActiveTab(index)}
                    >
                        {tab.title}
                    <  / button >
                ))}
            <  / div >
            < div className = {classes.tabContent} >
                {tabs[activeTab].content}
            <  / div >
        <  / div >
    );
};
