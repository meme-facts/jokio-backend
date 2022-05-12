import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class messages1652140454060 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'messages',
                columns: [
                    {
                        name:'id',
                        type: 'uuid',
                        isPrimary:true
                    },
                    {
                        name: 'message',
                        type: 'varchar',
                    },
                    {
                        name: 'isRead',
                        type: 'boolean',
                    },
                    {
                        name: 'fromUser',
                        type: 'uuid'
                    },
                    {
                        name: 'toUser',
                        type: 'uuid'
                    }, 
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    
                ],
                foreignKeys: [
                    {
                      name: 'FKUserFollowerRequested',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['fromUser'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    },
                    {
                      name: 'FKUserFollowerRequester',
                      referencedTableName: 'users',
                      referencedColumnNames: ['id'],
                      columnNames: ['toUser'],
                      onDelete: 'SET NULL',
                      onUpdate: 'SET NULL',
                    }
                  ],
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('messages');
    }

}
