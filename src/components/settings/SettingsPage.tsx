import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useVocabulary } from '../../context/VocabularyContext.tsx';
import {
  User as UserIcon,
  Mail,
  Shield,
  KeyRound,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Save,
  Calendar,
} from 'lucide-react';
import { parseItemDate } from '../../utils/vocabulary.ts';

export const SettingsPage: React.FC = () => {
  const { userProfile, currentUser, updateDisplayNameProfile, sendPasswordReset, logout } = useAuth();
  const { addToast } = useVocabulary();

  const [name, setName] = useState(userProfile?.fullName || currentUser?.displayName || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [nameSuccess, setNameSuccess] = useState<string | null>(null);

  const [isSendingReset, setIsSendingReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const [copiedUid, setCopiedUid] = useState(false);

  // Check auth providers
  const isGoogleUser = currentUser?.providerData?.some((p) => p.providerId === 'google.com');

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(null);

    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Full name cannot be empty.');
      return;
    }

    setIsUpdatingName(true);
    try {
      await updateDisplayNameProfile(trimmed);
      setNameSuccess('Display name updated successfully in your account and Firestore!');
      addToast('Profile name updated!', 'success');
      setTimeout(() => setNameSuccess(null), 4000);
    } catch (err: any) {
      setNameError(err?.message || 'Failed to update name.');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleSendPasswordReset = async () => {
    if (!currentUser?.email) return;
    setResetError(null);
    setResetSuccess(null);
    setIsSendingReset(true);
    try {
      await sendPasswordReset(currentUser.email);
      setResetSuccess(`Password reset instructions sent to ${currentUser.email}.`);
      addToast('Password reset link sent to your email!', 'info');
      setTimeout(() => setResetSuccess(null), 5000);
    } catch (err: any) {
      setResetError(err?.message || 'Failed to send password reset email.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const copyUidToClipboard = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  const memberSinceDate = currentUser?.metadata?.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : userProfile?.createdAt
    ? parseItemDate(userProfile.createdAt)?.toLocaleDateString()
    : 'Active member';

  const getInitials = (val: string) => {
    const parts = val.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return val.slice(0, 2).toUpperCase();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Account Settings
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal profile, credentials, and synchronized account preferences.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {userProfile?.photoURL ? (
            <img
              src={userProfile.photoURL}
              alt={userProfile.fullName || 'User'}
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/10 shadow-sm"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-xl flex items-center justify-center shadow-md shadow-indigo-600/20">
              {getInitials(userProfile?.fullName || currentUser?.displayName || 'User')}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {userProfile?.fullName || currentUser?.displayName || 'Lexora Member'}
            </h3>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentUser?.email}</span>
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <Shield className="w-3 h-3 text-indigo-500" />
                <span>{isGoogleUser ? 'Google Account' : 'Email & Password'}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>Joined {memberSinceDate}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Display Name Form */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Personal Information</h3>
        <p className="text-xs text-slate-500 mb-5">
          Update how your name appears across your Lexora dashboard and vocabulary vault.
        </p>

        {nameError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{nameError}</span>
          </div>
        )}

        {nameSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{nameSuccess}</span>
          </div>
        )}

        <form onSubmit={handleUpdateName} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 tracking-wider mb-1.5">
              Email Address (Primary)
            </label>
            <input
              type="text"
              disabled
              value={currentUser?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Your email address is managed through your primary authentication provider.
            </p>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isUpdatingName || name.trim() === userProfile?.fullName}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all disabled:opacity-40"
            >
              {isUpdatingName ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security & Password */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">Security & Authentication</h3>
        <p className="text-xs text-slate-500 mb-5">
          Manage your password and authentication credentials.
        </p>

        {resetError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{resetError}</span>
          </div>
        )}

        {resetSuccess && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{resetSuccess}</span>
          </div>
        )}

        {isGoogleUser ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs leading-relaxed flex items-start gap-3">
            <Shield className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-900">Protected by Google Single Sign-On</p>
              <p className="text-slate-500 mt-0.5">
                Your account is authenticated via Google. Password updates and multi-factor authentication are secured directly through your Google Account settings.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Reset Password
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Receive an email with a secure link to update your password.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSendPasswordReset}
              disabled={isSendingReset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto disabled:opacity-50"
            >
              <KeyRound className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isSendingReset ? 'Sending...' : 'Send Password Reset Email'}</span>
            </button>
          </div>
        )}

        {/* UID Display */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="truncate max-w-[200px] sm:max-w-none">
            User ID: <code className="text-slate-600 font-mono text-[11px]">{currentUser?.uid}</code>
          </span>
          <button
            type="button"
            onClick={copyUidToClipboard}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 text-xs font-medium"
          >
            {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUid ? 'Copied' : 'Copy UID'}</span>
          </button>
        </div>
      </div>

      {/* Danger Zone: Log Out */}
      <div className="p-6 rounded-2xl bg-red-50/50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-red-900">Sign Out of Lexora</h4>
          <p className="text-xs text-red-700/80 mt-0.5">
            Your saved words are securely preserved in Cloud Firestore and will be waiting when you return.
          </p>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
