import Navbar from '../components/Navbar'
import Card from '../components/Card'
function Home() {
    return (
        <div>
            <Navbar />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <Card icon='Calendar' title='Rezervasyonlar' />
                <Card icon='User' title='Müşteriler' />
                <Card icon='Sms' title='Mesaj Gönder' />
            </div>
        </div>
    )
}

export default Home