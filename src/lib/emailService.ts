/**
 * Email Service - Automated order notifications
 * Sends silent background emails for order events
 * No UI changes, no visible functionality changes
 */

interface OrderData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  totalPrice: number;
  items: any[];
  phone?: string;
  address?: string;
}

interface CancellationData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  reason?: string;
}

interface DeletionData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  adminEmail: string;
}

import { supabase } from './supabase';

/**
 * Silent email sender - calls Supabase Edge Function
 * Fails silently to never disrupt user experience
 */
const sendEmailToBackend = async (eventType: string, data: any) => {
  try {
    const { error, data: responseData } = await supabase.functions.invoke('send-email', {
      body: { eventType, ...data },
    });

    if (error) {
      console.warn(`Email sending failed for event: ${eventType}`, error);
    }
  } catch (error) {
    // Silent fail - don't disrupt user experience
    console.warn('Email service unavailable:', error);
  }
};

/**
 * Notifies when order is placed
 * Sends to: customer & admin
 */
export const notifyOrderPlaced = async (orderData: OrderData) => {
  await sendEmailToBackend('ORDER_PLACED', orderData);
};

/**
 * Notifies when order is cancelled by customer
 * Sends to: customer & admin
 */
export const notifyOrderCancelled = async (cancellationData: CancellationData) => {
  await sendEmailToBackend('ORDER_CANCELLED', cancellationData);
};

/**
 * Notifies when order is deleted by admin
 * Sends to: customer & admin
 */
export const notifyOrderDeleted = async (deletionData: DeletionData) => {
  await sendEmailToBackend('ORDER_DELETED', deletionData);
};
