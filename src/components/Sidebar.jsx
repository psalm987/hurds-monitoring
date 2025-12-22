import { formatPhoneNumber, formatTime } from "../lib/utils";
import { useContacts } from "../hooks/useSupabase";

export function Sidebar({ selectedContact, onSelectContact }) {
  const { contacts, loading } = useContacts();

  if (loading) {
    return (
      <div className="w-80 border-r border-border bg-card flex items-center justify-center">
        <p className="text-muted-foreground">Loading contacts...</p>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col shadow-sm">
      <div className="p-6 border-b border-border bg-linear-to-r from-primary/5 to-primary/10">
        <h2 className="text-xl font-bold text-primary">Messages</h2>
        <p className="text-xs text-muted-foreground mt-1">HURDS Monitoring</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {contacts.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <p className="font-medium">No conversations yet</p>
            <p className="text-xs mt-1">Contacts will appear here</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <button
              key={contact.phoneNumber}
              onClick={() => onSelectContact(contact.phoneNumber)}
              className={`w-full p-4 border-b border-border hover:bg-accent transition-all duration-200 text-left group ${
                selectedContact === contact.phoneNumber
                  ? "bg-accent border-l-4 border-l-primary"
                  : "border-l-4 border-l-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-semibold group-hover:text-primary transition-colors ${
                    selectedContact === contact.phoneNumber
                      ? "text-primary"
                      : ""
                  }`}
                >
                  {formatPhoneNumber(contact.phoneNumber)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(contact.lastMessage)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
