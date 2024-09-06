import FriendRequests from "./components/FriendRequests";
import YourRequests from "./components/YourRequests";

export default function AccountPage() {
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Account Page</h1>

      <h2 className="mt-5">Notifications: </h2>
      <div className="bg-gray-900 rounded p-5">
        <p>Friends requests:</p>
        <ul>
          <FriendRequests />
        </ul>
      </div>

      <div className="bg-gray-900 rounded p-5 mt-5">
        <p>Your requests: </p>
        <ul>
          <YourRequests />
        </ul>
      </div>

    </div>
  )
}