import { PrismaClient, invoiceStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { log } from 'console';

const prisma = new PrismaClient();

async function main() {
    console.log('iniciando população do banco de dados...');

    const password = await bcrypt.hash('password', 10);
    
    const user = await prisma.user.upsert({
        where: { email: 'admin@email.com' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@email.com',
            password: password,
        },
    });

    console.log('Usuário criado: ${user.email}');

    const customers_data = [{
        name: 'Marcos',
        email: 'marcos@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Marcos&background=random',
    }, {
        name: 'Caio Santos',
        email: 'caio@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Caio+Santos&background=random',
    }, {
        name: 'Andre Arruda',
        email: 'andre@email.com',
        imageUrl: 'https://ui-avatars.com/api/?name=Andre+Arruda&background=random',
    }]

    const customers = [];

    for (const data of customers_data) { 
        const customer = await prisma.customer.upsert({
            where: { email: data.email },
            update: {},
            create: data
        });

        customers.push(customer);

        console.log('Clientes criados: ${customer.name}'); 
    }  
    
    const invoices_data = [{
        amount: 9349534,
        date: '2026-07-01',
        status: invoiceStatus.PAGO,
        customer: customers[0],
    },{
        amount: 123456,
        date: '2026-07-02',
        status: invoiceStatus.PENDENTE,
        customer: customers[1],
    },{
        amount: 654321,
        date: '2026-07-03',
        status: invoiceStatus.PAGO,
        customer: customers[2],
    }, {
        amount: 789012,
        date: '2026-07-04',
        status: invoiceStatus.PENDENTE,
        customer: customers[0],
    }, {
        amount: 345678,
        date: '2026-07-05',
        status: invoiceStatus.PAGO,
        customer: customers[1],
    }, {
        amount: 901234,
        date: '2026-07-06',
        status: invoiceStatus.PENDENTE,
        customer: customers[2],
    }, {
        amount: 567890,
        date: '2026-07-07',
        status: invoiceStatus.PAGO,
        customer: customers[0],
    }, { 
        amount: 123456,
        date: '2026-07-08',
        status: invoiceStatus.PENDENTE,
        customer: customers[1],
    }, {
        amount: 789012,
        date: '2026-07-09',
        status: invoiceStatus.PAGO,
        customer: customers[2],
    }, {
        amount: 345678,
        date: '2026-07-10',
        status: invoiceStatus.PENDENTE,
        customer: customers[0],
    }, {
        amount: 901234,
        date: '2026-07-11',
        status: invoiceStatus.PAGO,
        customer: customers[1],
    }
    
    ];

    for (const invoice of invoices_data) {
        await prisma.invoice.create({
            data: {
                amount: invoice.amount,
                date: new Date(invoice.date),
                status: invoice.status,
                customerId: invoice.customer.id,
            }
        })
    };

    console.log(`${invoices_data.length} faturas criadas.`);

    const revenue_data = [{
        month: 'Jan',
        revenue: 9384892
    }, {
        month: 'Feb',
        revenue: 1234567
    },{
        month: 'Mar',
        revenue: 6543210
    }, {
        month: 'Apr',
        revenue: 7890123
    }, {
        month: 'May',
        revenue: 3456789
    }, {
        month: 'Jun',
        revenue: 9012345
    }, {
        month: 'Jul',
        revenue: 5678901
    }, {
        month: 'Aug',
        revenue: 1234567
    }, {
        month: 'Sep',
        revenue: 7890123
    }, {
        month: 'Oct',
        revenue: 3456789
    }, {
        month: 'Nov',
        revenue: 9012345
    }, {
        month: 'Dec',
        revenue: 5678901
    }];

    for (const data of revenue_data) {
        await prisma.revenue.upsert({
            where: { month: data.month },
            update: { revenue: data.revenue },
            create: data
        });
    };

    console.log('Dados da receita mensal criados.');

    console.log('População concluida com sucesso!');
};

main()
    .catch((error) => {
        console.log('Erro ao popular banco de dados:', error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
});