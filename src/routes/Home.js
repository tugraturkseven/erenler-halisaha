import Navbar from '../components/Navbar'
import Card from '../components/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

function Home() {

    const user = auth.currentUser;
    console.log('writed from home page. ' + user.uid);

    const navigate = useNavigate();


    const logOutHandler = async () => {
        await signOut(auth).then(() => {
            navigate("/")
        }).catch((error) => {
            console.log(error);
        });
    }

    const logOut = (

        <a onClick={logOutHandler} className='btn btn-ghost normal-case '>
            <FontAwesomeIcon icon={faArrowRightFromBracket} size='xl' />
        </a>
    )


    return (
        <div>
            <Navbar endButton={logOut} />
            <div className='flex flex-col justify-between items-center md:flex-row lg:justify-around'>
                <Card icon='Calendar' title='Rezervasyonlar' />
                <Card icon='User' title='Müşteriler' />
                <Card icon='Sms' title='Mesaj Gönder' />
            </div>
        </div>
    )
}

export default Home