import Navbar from "../components/Navbar";
import HeroSection from '../components/HeroSection';

export default function NoPage() {
    return (
        <>
            <Navbar />
            <div className = "max-w-7xl mx-auto">
                <HeroSection />
            </div>
        </>
    )
}