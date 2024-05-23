import linkedin from '../../../public/assets/linkedin.png'
import instagram from '../../../public/assets/instagram.png'
import youtube from '../../../public/assets/youtube.png'
import git from '../../../public/assets/git.png'
import Image from 'next/image'

const Footer = () => {
    return (
        <div className="bg-[#473BF0] h-auto py-2  md:h-16 flex flex-col sm:flex-row  justify-between items-center px-4">
            <div className='flex gap-4 items-center'>

                <section className='w-7 h-7 flex justify-center items-center rounded-full bg-white'>
                    <Image  src={linkedin} alt="" />

                </section>
                <section className='w-7 h-7 flex justify-center items-center rounded-full bg-white'>
                    <Image  src={git} alt="" />
                </section>

                <section className='w-7 h-7 flex justify-center items-center rounded-full bg-white'>
                    <Image  src={instagram} alt="" />
                </section>
                <section className='w-7 h-7 flex justify-center items-center rounded-full bg-white'>
                    <Image  src={youtube} alt="" />

                </section>
            </div>

            <p className='text-white'>&copy; Lawyer AI 2024</p>
        </div>)
}

export default Footer;