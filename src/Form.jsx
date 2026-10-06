import { useActionState } from "react";
import supabase from "./supabase-api";

function Form() {
    const [error, submitAction, isPending] = useActionState(
        async function (prevState, formData) {
            try {
                const { error } = await supabase.from("sales_deals").insert({
                    name: formData.get("name"),
                    value: formData.get("value"),
                });

                if (error) {
                    throw new Error(error.message);
                }
            } catch (err) {
                console.error(err);
                return err.message;
            }
        }, null);

    return (
        <div className="add-form-container">
            <form action={submitAction}>
                <div className="sr-only">
                    Use this form to add a new sales deal. Select a sales rep
                    and enter the amount.
                </div>
                <label htmlFor="deal-name">
                    Name:
                    <input
                        type="text"
                        id="deal-name"
                        name="name"
                        className="name-input"
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        disabled={isPending}
                    />
                </label>
                <label htmlFor="deal-value">
                    Amount: $
                    <input
                        id="deal-value"
                        type="number"
                        name="value"
                        defaultValue={0}
                        className="amount-input"
                        min="0"
                        step="10"
                        aria-required="true"
                        aria-invalid={error ? "true" : "false"}
                        aria-label="Deal amount in dollars"
                        disabled={isPending}
                    />
                </label>
                <button
                    type="submit"
                    disabled={isPending}
                    aria-busy={isPending}
                >
                    {isPending ? "Adding..." : "Add Deal"}
                </button>
            </form>
            {error && (
                <div role="alert" className="error-message">
                    {error}
                </div>
            )}
        </div>
    );
}

export default Form;
