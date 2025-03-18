import { Metadata } from 'next';
import ProfileContent from '@/components/ProfileContent';

export const metadata: Metadata = {
  title: 'Minha Conta - Luma Events',
  description: 'Gerencie sua conta e pedidos no Luma Events',
};

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm">
          {/* Profile Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Minha Conta</h1>
          </div>

          <ProfileContent />
        </div>
      </div>
    </div>
  );
}