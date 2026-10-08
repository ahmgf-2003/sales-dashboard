import { useEffect, useState } from "react";
import supabase from "../apis/supabase-api";
import { Chart } from "react-charts";
import Form from "../components/Form";

function Dashboard() {
    const [metrics, setMetrics] = useState([]);

    const fetchMetrics = async () => {
        try {
            const { data, error } = await supabase.from("sales_deals").select(
                `
                    name,
                    value.sum()
                    `,
            );

            if (error) {
                throw error.message;
            }
            setMetrics(data);
        } catch (err) {
            console.error("error and stuff:-\n", err);
        }
    };

    useEffect(() => {
        fetchMetrics();

        const channel = supabase
            .channel("deal-changes")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "sales_deals",
                },
                (payload) => {
                    fetchMetrics();
                },
            )
            .subscribe();

        // Clean up subscription
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const chartData = [
        {
            data: metrics.map((metric) => ({
                primary: metric.name,
                secondary: metric.sum,
            })),
        },
    ];

    const primaryAxis = {
        getValue: (d) => d.primary,
        scaleType: "band",
    };

    const secondaryAxes = [
        {
            getValue: (d) => d.secondary,
            scaleType: "linear",
            min: 0,
            max: yMax(),
        },
    ];

    function yMax() {
        if (metrics.length > 0) {
            return Math.max(...metrics.map((metric) => metric.sum)) + 2000;
        }

        return 5000;
    }

    return (
        <section className="chart-section">
            <div className="chart-container">
                <h2>Total Sales This Quarter ($)</h2>
                <div className="chart">
                    <Chart
                        options={{
                            data: chartData,
                            primaryAxis,
                            secondaryAxes,
                            type: "bars",
                            defaultColors: ["#58d675"],
                        }}
                    />
                </div>
            </div>
            <Form />
        </section>
    );
}

export default Dashboard;
