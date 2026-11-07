import { Link } from "react-router-dom"
import Section from "../components/ui/Section"
import StateMessage from "../components/ui/StateMessage"

export default function NotFound() {
  return (
    <Section>
      <StateMessage title="Page not found" message="Let's get you back to the homes."
        action={<Link to="/" className="btn btn-primary">Go home</Link>} />
    </Section>
  );
}