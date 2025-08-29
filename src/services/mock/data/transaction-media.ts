import { TransactionMedia } from '../../types/transaction-media';

export const mockTransactionMedia: TransactionMedia[] = [
  {
    id: 'tm_001',
    transaction_id: 't_001',
    uri: 'file://receipts/receipt_001.jpg',
    type: 'receipt',
    created_at: 1722124800000, // 27 Jul 2025
    updated_at: 1722124800000
  },
  {
    id: 'tm_002',
    transaction_id: 't_003',
    uri: 'file://receipts/receipt_003.jpg',
    type: 'receipt',
    created_at: 1722124800000, // 27 Jul 2025
    updated_at: 1722124800000
  },
  {
    id: 'tm_003',
    transaction_id: 't_005',
    uri: 'file://receipts/receipt_005.jpg',
    type: 'receipt',
    created_at: 1722124800000, // 27 Jul 2025
    updated_at: 1722124800000
  },
  {
    id: 'tm_004',
    transaction_id: 't_006',
    uri: 'file://images/poke_bowl.jpg',
    type: 'image',
    created_at: 1722124800000, // 27 Jul 2025
    updated_at: 1722124800000
  },
  {
    id: 'tm_005',
    transaction_id: 't_008',
    uri: 'file://images/coffee.jpg',
    type: 'image',
    created_at: 1722038400000, // 26 Jul 2025
    updated_at: 1722038400000
  },
  {
    id: 'tm_006',
    transaction_id: 't_009',
    uri: 'file://images/dinner.jpg',
    type: 'image',
    created_at: 1722038400000, // 26 Jul 2025
    updated_at: 1722038400000
  }
];

