import { IoPersonAdd } from 'react-icons/io5'
import { MdGroupAdd } from 'react-icons/md'
import { BsPersonCircle } from 'react-icons/bs'
import { TiHome } from 'react-icons/ti'
import Link from 'next/link'

export default function Header() {
  return (
    <section className="bg-gray-900 text-white flex md:px-10 px-5 py-5">
      <div>
        <ul className="flex">
          <li className="border-r pr-2 md:mr-5 mr-2 my-auto">
            <Link href="/chat" className="flex">
              <strong className="my-auto">
                <TiHome size={20} />
              </strong>
              Home
            </Link>
          </li>
          <li className="md:pr-5 pr-2 my-auto">
            <Link className="flex" href="/new/friend">
              <strong className="my-auto">
                <IoPersonAdd />
              </strong>{' '}
              New friend
            </Link>
          </li>
          <li className="my-auto">
            <Link className="flex" href="/new/group">
              <strong className="my-auto">
                <MdGroupAdd />
              </strong>{' '}
              New group
            </Link>
          </li>
        </ul>
      </div>
      <div className='ml-auto border-l md:pl-10 pl-5'>
        <div className="my-auto">
          <Link className="flex" href="/account">
            <strong className="my-auto">
              <BsPersonCircle size={25} />
            </strong>
          </Link>
        </div>
      </div>
    </section>
  )
}
