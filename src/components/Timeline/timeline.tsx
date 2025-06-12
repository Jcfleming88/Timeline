import React from "react";

import { default as Event } from "./timelineEvent";
import { Node } from "./node";
import styles from "src/components/Timeline/timeline.module.css";

const getDaysBetween = (date1: Date, date2: Date): number => {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

//export function Timeline({ dates }: { dates: Event[] }) {
const Timeline: React.FC<{ dates: Event[] }> = ({ dates }) => {
    // Set out the nodes for each of the events
    const [nodes, setNodes] = React.useState<Node[]>([]);

    const [title, setTitle] = React.useState<string>("Select Event");
    const [description, setDescription] = React.useState<string>("Select an event to see more detail.");

    const minX = 50;
    const maxX = 200;

    React.useEffect(() => {
        // Sort the dates by date
        const sortedDates = [...dates].sort((a, b) => a.date.getTime() - b.date.getTime());

        var minGap = Infinity;
        var maxGap = 0;

        // Calculate the gaps between the dates
        for (let i = 0; i < sortedDates.length - 1; i++) {
            const gap = getDaysBetween(sortedDates[i + 1].date, sortedDates[i].date);
            if (gap < minGap && gap !== 0) {
                minGap = gap;
            }
            if (gap > maxGap) {
                maxGap = gap;
            }
        }

        // Create nodes for each date
        var pos = 0;
        var length = 0;
        var layer = 0;
        const nodes = sortedDates.map((event, index) => {
            const node = new Node(
                index,
                event.date,
                event.name,
                event.grouping || "",
                event.description || "",
                pos,
                layer
            );

            if (index < sortedDates.length - 1) {
                if (sortedDates[index].date.getTime() === sortedDates[index + 1].date.getTime()) {
                    // Move down a layer
                    layer++;
                } else {
                    const diff = getDaysBetween(sortedDates[index + 1].date, sortedDates[index].date);
                    pos += Math.ceil(minX + ((maxX - minX) * (diff / (maxGap - minGap))));
                    if (pos > length) {
                        length = pos; // Update the length if the new position exceeds it
                    }
                }
            }

            return node;
        });

        // Set the width of the graph based on the last node's position
        const graphElement = document.getElementById(`graph`);
        if (graphElement) {
            graphElement.style.width = `${length}px`; // Add some padding
        }

        setNodes(nodes);
    }, [dates]);

    const scrollLeft = () => {
        const timeline = document.querySelector(`.${styles.timeline}`);
        if (timeline) {
            timeline.scrollLeft -= 100; // Adjust the scroll amount as needed
        }
    }

    const scrollRight = () => {
        const timeline = document.querySelector(`.${styles.timeline}`);
        if (timeline) {
            timeline.scrollLeft += 100; // Adjust the scroll amount as needed
        }
    }

    const selectEvent = (id: number) => {
        const node = nodes.find(n => n.id === id);

        if (node) {
            setTitle(node.grouping != "" && node.grouping != null ? `${node.name} - ${node.grouping}` : node.name);
            setDescription(node.description);
        } else {
            setTitle("Select Event");
            setDescription("Select an event to see more detail.");
        }
    }

    return (
        <>
            <div style={{ width: "100%" }} className={styles.container}>
                <div className={styles.timeline}>
                    <div className={styles.dates} id="1">
                        {
                            Array.from(new Set(nodes.map(node => `${node.date.getDate()}-${node.date.getMonth()}-${node.date.getFullYear()}`))).map((dateString, index) => {
                                const node = nodes.find(n => `${n.date.getDate()}-${n.date.getMonth()}-${n.date.getFullYear()}` === dateString);
                                return node ? (
                                    <div
                                        key={index}
                                        className={styles.datelabels}
                                        style={{
                                            left: `${node.pos}px`,
                                        }}
                                    >
                                        {dateString}
                                    </div>
                                ) : null;
                            })
                        }
                    </div>
                    <div className={styles.graph} id="graph" style={{ height: `${(Math.max(...nodes.map((node) => node.layer)) + 1 ) * 20}px` }}>
                        {
                            nodes.map((node, index) => {
                                return (
                                    <div key={node.id}>
                                        <button className={styles.node} style={{ left: `${node.pos}px`, top: `${(node.layer + 1) * 20}px` }} onClick={() => selectEvent(node.id)} />
                                        <div className={styles.nodeLabel} style={{ left: `${node.pos + 16}px`, top: `${(node.layer + 1) * 20 - 16}px` }}>
                                            {node.grouping != "" && node.grouping != null ? `${node.name} - ${node.grouping}` : node.name}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                <div className={styles.scrollButtons}>
                    <button className={styles.leftScroll} onClick={scrollLeft}>
                        <img src="/arrow.png" alt="Scroll Left" />
                    </button>
                    <button className={styles.rightScroll} onClick={scrollRight}>
                        <img src="/arrow.png" alt="Scroll Right" />
                    </button>
                </div>
                <div className={styles.descriptions} id="2">
                    <h1>{title}</h1>
                    <p>{description}</p>
                </div>
            </div>
        </>
    );
}

export default Timeline;