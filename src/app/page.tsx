import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import AboutSectionComponent from '@/components/main-sections/about/AboutSection'
import ApplySectionComponent from '@/components/main-sections/apply/ApplySection'
import MainPageCarousel from '@/components/main-sections/carousel/MainPageCarousel'
import NewsSectionComponent from '@/components/main-sections/news/NewsSection'
import SubmitSectionComponent from '@/components/main-sections/submit/SubmitSection'
import SupportSectionComponent from '@/components/main-sections/support/SupportSection'
import ThreeBlocksSecionComponent from '@/components/main-sections/three-blocks/ThreeBlockSection'

export default function Page() {
	return (
		<div className='neon-gradient-background'>
			<Navbar />
			<MainPageCarousel />
			<ThreeBlocksSecionComponent />
			<NewsSectionComponent />
			<AboutSectionComponent />
			<SupportSectionComponent />
			<ApplySectionComponent />
			<SubmitSectionComponent />
			<Footer />
		</div>
	)
}
