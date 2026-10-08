import { useAuth } from "../contexts/Auth";

const Signin = () => {
    const session = useAuth();

    return (
        <>
            <h1 className="landing-header">Paper Like A Boss</h1>
        </>
    );
};

export default Signin;
