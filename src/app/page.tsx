import Footer from '@/components/Layout/Footer/Footer'
import Navbar from '@/components/Layout/Navbar/Navbar'
import AboutSectionComponent from '@/components/MainPage/About/AboutSection'
import ApplySectionComponent from '@/components/MainPage/Apply/ApplySection'
import MainPageCarousel from '@/components/MainPage/Carousel/MainPageCarousel'
import NewsSectionComponent from '@/components/MainPage/News/NewsSection'
import SubmitSectionComponent from '@/components/MainPage/OrderForm/OrderForm'
import SupportSectionComponent from '@/components/MainPage/Support/SupportSection'
import ThreeBlocksSecionComponent from '@/components/MainPage/ThreeBlocks/ThreeBlockSection'

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
